/*
Oxhr v1.0.1
An object-oriented XHR (XMLHttpRequest) wrapper/library.
Copyright 2021 Jan Prazak, https://github.com/Amarok24/Oxhr
Licensed under the Apache License, Version 2.0
*/

export type { IXhrParams, IResolve, IReject, IRequestHeader };

/**
 *	Parameters for Oxhr.
 *	@param url "URL" for request. The only mandatory parameter.
 *	@param method "get" or "post". Default: "get".
 *	@param data Data to send with request. Supports all valid data types. Default: null.
 *	@param responseType A valid response type. Default: "".
 *	@param requestHeaders Custom HTTP headers. Array of IRequestHeader.
 *	@param consoleInfo Description of console.group for console output.
 *	@param timeoutMs Timeout in milliseconds after which connection will be interrupted.
 *	@param OnLoadEnd Called after load success, timeout, abort or error.
 *	@param OnProgress Callback function to which the loading progress in % shall be passed.
 *	@param OnTimeOut Callback function for timeout.
 *	@param OnAbort Callback function when an open connection is aborted.
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
	OnLoadEnd?: () => void;
	OnProgress?: (percent: number, bytes: number) => void;
	OnTimeOut?: () => void;
	OnAbort?: () => void;
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
