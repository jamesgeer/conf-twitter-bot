import React, { Component } from 'react';

import axios, { AxiosError } from 'axios';

export default class Book extends Component {
	// @ts-ignore
	constructor(props) {
		super(props);
		this.state = {
			books: [],
		};
		this.loadBooks = this.loadBooks.bind(this);
	}

	componentDidMount() {
		this.loadBooks().then();
	}

	async loadBooks() {
		try {
			const res = await axios.get('http://localhost:3001/book');

			this.setState({ books: res.data });
		} catch (err) {
			console.log(`Error: ${(err as AxiosError)?.response?.data}`);
		}

		// const promise = await axios.get('http://localhost:3000/book');
		// const status = promise.status;
		// console.log(status);
		// if (status === 200) {
		// 	const data = promise.data;
		// 	console.log(data);
		// 	this.setState({ books: data });
		// }
	}

	render() {
		return (
			<div>
				<h1>Books</h1>
				{/* @ts-ignore */}
				{this.state.books.map((value, index) => {
					return <h4 key={index}>{value}</h4>;
				})}
			</div>
		);
	}
}
