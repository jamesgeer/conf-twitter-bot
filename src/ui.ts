import { getPaperById, loadQueuedTweets, loadUrls, postTweet, getConfiguration, persistConfig } from "./data-client.js";
import { Paper, PaperForTemplate, Tweet } from "./data.js";
import { Config } from "./util.js";
import { afterNDays, formatDateOnly, formatDateStrWithTime, formatDateWithTime, formatMinutesAsHHmm, getRandomMinute,
  hourMinuteStrToMinutesSinceMidnightUTC, isWithinScheduleParameters, SchedulingConfig, SchedulingConfigJson } from "./scheduling.js";

declare function html2canvas(div: any): Promise<any>;
declare const Mustache: any;

function readScheduleConfig(): SchedulingConfig | null {
  let value: any = $('#nextDate').val();
  if (!value) { return null; }

  const nextDate = new Date(value);

  value = $('#everyNDays').val();
  if (!value && Number(value) > 0) { return null; }

  const everyNDays = Number(value);

  value = $('#earliestHour').val();
  if (!value) { return null; }

  let earliestTime = hourMinuteStrToMinutesSinceMidnightUTC(value);

  value = $('#latestHour').val();
  if (!value) { return null; }

  let latestTime = hourMinuteStrToMinutesSinceMidnightUTC(value);

  // just in case...
  if (latestTime < earliestTime) {
    const tmp = latestTime;
    latestTime = earliestTime;
    earliestTime = tmp;
  }

  return {
    nextDate, everyNDays,
    earliestTime, latestTime
  };
}

let persistedSchedulingConfig: SchedulingConfigJson | undefined = undefined;

async function persistScheduleConfig(config: SchedulingConfig) {
  const newConfig = {
    nextDate: config.nextDate.toJSON(),
    everyNDays: config.everyNDays,
    earliestTime: config.earliestTime,
    latestTime: config.latestTime
  }
  if (persistedSchedulingConfig !== undefined) {
    if (newConfig.nextDate === persistedSchedulingConfig.nextDate
      && newConfig.everyNDays === persistedSchedulingConfig.everyNDays
      && newConfig.earliestTime === persistedSchedulingConfig.earliestTime
      && newConfig.latestTime === persistedSchedulingConfig.latestTime) {
        // already persisted
        return;
      }
  }

  persistedSchedulingConfig = newConfig;
  await saveAndApplyConfig();
}

function updateSchedule(): void {
  const config = readScheduleConfig();
  if (config === null) {
    return;
  }
  persistScheduleConfig(config);

  let nextDate = config.nextDate;
  $('.tw-queue-item').each((_i, elem) => {
    const nextDateWithTime = new Date(nextDate);
    nextDate = afterNDays(nextDate, config.everyNDays);

    nextDateWithTime.setMinutes(getRandomMinute(config.earliestTime, config.latestTime));

    const currentTime = $(elem).attr('data-scheduled-time');
    if (currentTime) {
      const currentTimeDate = new Date(currentTime);
      if (isWithinScheduleParameters(nextDateWithTime, currentTimeDate, config)) {
        // no need to update it
        return;
      }
    }
    $(elem).find('.tw-scheduled-time').text(formatDateWithTime(nextDateWithTime));
    const persistedTweet: Tweet = $(elem).data('tweetObj');
    console.assert(typeof persistedTweet === 'object');
    persistedTweet.scheduledTime = nextDateWithTime.toJSON();
    postTweet(persistedTweet);
  });
}

function paperDetails(d: Paper): JQuery<HTMLElement> {
  selectedPaper = d;
  if (!d.fullAbstract) {
    getFullAbstract(d);
  }

  const content = renderPaper(d, <string>$('#picture-tpl').val());

  const paper = `
  <div id="paper-${d.id}">
    <div class="p-details" contenteditable="true">${content}</div>
  </div>`;
  return $(paper);
}

async function renderPaperDetails(paper: Paper): Promise<string> {
  if (!paper.fullAbstract) {
    const withFullAbstract = await getPaperById(paper.id);
    if (withFullAbstract) {
      paper = withFullAbstract;
    }
  }

  const content = renderPaper(paper, <string>$('#picture-tpl').val());

  $('#render-image').html(
    `<div class="p-details">${content}</div>`);
  const detailsJQDiv = $('#render-image .p-details');
  const dataUrl = await renderDivToImage(detailsJQDiv[0]);
  detailsJQDiv.remove();
  return dataUrl;
}

async function getFullAbstract(d: Paper) {
  const paper = await getPaperById(d.id);

  if (paper && paper.fullAbstract) {
    $(`#paper-${d.id} .p-abstract`).html(paper.fullAbstract);
  }
}

let paperTable: any = null;
let selectedPaper: Paper | null = null;

function showInQueue(tweet: Tweet): JQuery<HTMLElement> {
  let scheduledTime: string;
  if (tweet.scheduledTime) {
    scheduledTime = formatDateStrWithTime(tweet.scheduledTime);
  } else {
    scheduledTime = '';
  }

  let id: string;
  if (typeof tweet.id === 'number') {
    id = tweet.id.toString();
  } else {
    id = '';
  }

  const elem = $(`
    <div class="tw-queue-item" id="tweet-for-paper-${tweet.paperId}" data-tweet-id="${id}">
      <div class="tw-scheduled-time" data-scheduled-time="${tweet.scheduledTime || ''}">${scheduledTime}</div>
      <div class="tw-queue-text">${tweet.text}</div>
      <div class="tw-queue-img"><img src="${tweet.image}"></div>
    </div>
  `);

  if (tweet.sent) {
    $('#tweets-sent').append(elem);
  } else {
    $("#tweet-queue").append(elem);
  }
  elem.data('tweetObj', tweet);
  return elem;
}



async function queueTweet() {
  if (!selectedPaper) {
    return;
  }

  const dataUrl = await renderPaperDetails(selectedPaper);
  const tweetText = <string>$('#tweet').val();
  const id = <number>selectedPaper.id;

  const elem = showInQueue({
    text: tweetText,
    image: dataUrl,
    paperId: id});

  const persistedTweet = await postTweet({
    text: tweetText,
    image: dataUrl,
    paperId: id
  });
  if (persistedTweet !== null) {
    elem.attr('data-tweet-id', <number>persistedTweet.id);
    elem.data('tweetObj', persistedTweet);
    updateSchedule();
  }
}

async function renderDivToImage(div: HTMLElement): Promise<string> {
  try {
    const canvas = await html2canvas(div);
    const dataUrl = canvas.toDataURL();
    return dataUrl;
  } catch (error) {
    console.error('Error when rending abstract to image for twitter', error);
    throw error;
  };
}

function togglePaperDetails(this: HTMLElement): void {
  if (!paperTable) { return; }

  const tr = $(this).closest('tr');
  const row = paperTable.row(tr);
  if (!row.data()) {
    return;
  }

  if (row.child.isShown()) {
    row.child.hide();
    tr.removeClass('shown');
  } else {
    const detailsElem = paperDetails(row.data());
    row.child(detailsElem).show();
    tr.addClass('shown');
  }
}

function togglePaperSelected(this: HTMLElement): void {
  if ($(this).hasClass('selected')) {
    $(this).removeClass('selected');
  } else {
    const tr = $(this).closest('tr');
    const row = paperTable.row(tr);

    if (!row.data()) {
      return;
    }

    paperTable.$('tr.selected').removeClass('selected');
    $(this).addClass('selected');
    renderPaperInTemplate(row.data());
  }
}

function renderPaperInTemplate(paper: Paper): void {
  selectedPaper = paper;
  const tweet = renderPaper(paper, <string>$('#tweet-tpl').val());
  $('#tweet').val(tweet);
  tweetLength();
}

function renderPaper(paper: Paper, template: string): string {
  if (template && template.length > 0) {
    const p = <PaperForTemplate>{...paper};
    if (p.fullAbstract) {
      p.abstract = p.fullAbstract;
    } else {
      p.abstract = p.shortAbstract;
    }

    p.fullAuthors = p.authors.join(', ');

    return Mustache.render(template, p);
  }
  return '';
}

function createTable(data: Paper[]): any {
  return $('#papers').DataTable({
    columns: [
      {
        className: 'dt-control',
        orderable: false,
        data: null,
        defaultContent: ''
      },
      {title: "Title",    data: 'title'},
      {title: "Type",     data: 'type',    visible: false},
      {title: "URL",      data: 'url',     visible: false},
      {title: "Authors",  data: d => d.authors.join(', ')},
      {title: "Month",    data: d => d.monthYear.split(' ')[0]},
      {title: "Year",     data: d => d.monthYear.split(' ')[1]},
      {title: "Pages",    data: 'pages',   visible: false},
      {title: "Abstract", data: 'shortAbstract', visible: false},
      {title: "Cites",    data: 'citations'},
      {title: "#Down",    data: 'downloads'}
    ],
    data: data
  });
}

async function loadPapers() {
  const urls = $('#urls').text().trim();
  const papers = await loadUrls(urls);

  paperTable?.destroy();
  paperTable = createTable(papers);

  // Add event listener for opening and closing details
  $('#papers tbody').on('click', 'td.dt-control', togglePaperDetails);
  $('#papers tbody').on('click', 'tr', togglePaperSelected);
}

async function loadTweets() {
  const tweets = await loadQueuedTweets();
  for (const tweet of tweets) {
    showInQueue(tweet);
  }

  $('#tweet-queue').sortable({
    update: updateSchedule
  });
}

async function loadConfig() {
  const data: Config = await getConfiguration();

  $('#tweet-tpl').val(data?.tweetTpl);
  $('#picture-tpl').val(data?.pictureTpl);
  $('#picture-style').val(data?.pictureStyle);
  $('#tweet-pic-style').text(data?.pictureStyle);

  if (data.scheduleConfig) {
    persistedSchedulingConfig = data.scheduleConfig;
    const date = new Date(persistedSchedulingConfig.nextDate);
    $('#nextDate').val(formatDateOnly(date));
    $('#everyNDays').val(persistedSchedulingConfig.everyNDays);
    $('#earliestHour').val(formatMinutesAsHHmm(persistedSchedulingConfig.earliestTime));
    $('#latestHour').val(formatMinutesAsHHmm(persistedSchedulingConfig.latestTime));
  }
}

async function saveAndApplyConfig() {
  const tweetTpl = <string>$('#tweet-tpl').val();
  const pictureTpl = <string>$('#picture-tpl').val();
  const pictureStyle = <string>$('#picture-style').val();

  $('#tweet-pic-style').text(pictureStyle);

  await persistConfig({
    tweetTpl, pictureTpl, pictureStyle,
    scheduleConfig: persistedSchedulingConfig
  });
}

function tweetLength() {
  const maxTweetLength = 280;
  let length = (<string>$('#tweet').val()).length;
  $('#tweet-length').text(`${length} / ${maxTweetLength}`);

  length = (<string>$('#tweet-tpl').val()).length;
  $('#tweet-tpl-length').text(`${length} / ${maxTweetLength}`);
}

$(async function(){
  $('#load-btn').click(loadPapers);
  $('#save-config-btn').click(saveAndApplyConfig);
  $('#tweet').keyup(tweetLength);
  $('#tweet-tpl').keyup(tweetLength);
  $('#queue-btn').click(queueTweet);
  $('#everyNDays').spinner({
    change: updateSchedule,
    stop: updateSchedule
  });

  $('#nextDate').change(updateSchedule)
  $('#everyNDays').change(updateSchedule)
  $('#earliestHour').change(updateSchedule);
  $('#latestHour').change(updateSchedule);


  loadTweets();
  await loadConfig();
  tweetLength();
});
