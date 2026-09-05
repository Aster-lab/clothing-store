import { NextResponse } from 'next/server';

//function for Json utils
export const response = (data: any, status = 200) => NextResponse.json(data, { status });

//function for redirect util
export const redirect = (path:string,baseUrl:string | URL, status = 307) => {
  return NextResponse.redirect(new URL(path,baseUrl),status) }