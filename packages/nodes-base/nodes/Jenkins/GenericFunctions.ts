import {
	OptionsWithUri,
} from 'request';

import {
	IExecuteFunctions,
	IExecuteSingleFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
} from 'n8n-core';

import {
	IDataObject, NodeApiError, NodeOperationError,
} from 'n8n-workflow';

export async function jenkinsApiRequest(this: IHookFunctions | IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions, method: string, uri: string, qs: IDataObject = {}, headers: IDataObject = {}, body: string = '', option: IDataObject = {}): Promise<any> { // tslint:disable-line:no-any
	const credentials = await this.getCredentials('jenkinsApi');
	if (credentials === undefined) {
		throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
	}

	const token = Buffer.from(`${credentials.username}:${credentials.apiKey}`).toString('base64');

	let options: OptionsWithUri = {
		headers: {
			'Accept': 'application/json',
			'Authorization': `Basic ${token}`,
			...headers
		},
		method,
		uri: `${uri}`,
		json: true,
		qs,
		body
	};
	options = Object.assign({}, options, option);
	console.log(options)
	try {
		return await this.helpers.request!(options);
	} catch (error) {
		// console.log(error)
		throw new NodeApiError(this.getNode(), error);
	}
}
