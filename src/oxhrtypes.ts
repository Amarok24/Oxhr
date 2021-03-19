/*
Oxhr v1.0
An object-oriented XHR (XMLHttpRequest) wrapper/library.
Copyright 2021 Jan Prazak, https://github.com/Amarok24/Oxhr
Licensed under the Apache License, Version 2.0
*/

export type { IXhrParams, IResolve, IReject, IRequestHeader };

/**
 *	Parameters for Oxhr.
 *	@param url "URL" for request.
 *	@param method "get" or "post". Default: get.
 *	@param data Data to send with request. Supports all valid data types. Default: null.
 *	@param responseType A valid response type. Default: "".
 *	@param requestHeaders Optional array of IRequestHeader.
 *	@param consoleInfo Description of console.group for console output.
 *	@param timeoutMs Timeout in milliseconds after which connection should be interrupted.
 *	@param LoadEnd Callback function for 'loadend'. Called after load success or timeout. When aborting a connection the 'loadend' callback also runs after 'abort' callback.
 *	@param Progress Callback function to which the loading progress in % shall be passed.
 *	@param TimeOut Callback function for timeout.
 *	@param Abort Callback function for 'abort' (when stopping an open connection).
 */
interface IXhrParams
{
	url: string;
	method?: "get" | "post";
	responseType?: XMLHttpRequestResponseType;
	data?: BodyInit | Document | null;
	requestHeaders?: IRequestHeader[];
	timeoutMs?: number;
	consoleInfo?: string;
	LoadEnd?: () => void;
	Progress?: (percent: number, bytes: number) => void;
	TimeOut?: () => void;
	Abort?: () => void;
}


interface IRequestHeader
{
	header: string;
	value: string;
}

interface IResolve<R>
{
	// Must be a function which takes one parameter of type <R> and returns nothing.
	(value: R | PromiseLike<R>): void;
	//(value: R): void;
}

interface IReject
{
	// Must be a function which takes one parameter of type Error and returns nothing.
	(value: Error): void;
}
