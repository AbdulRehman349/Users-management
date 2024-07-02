import { NextRequest, NextResponse } from 'next/server';
import { getAbsolutePath } from './utils/helpers';
import { AuthApi } from './lib/api/auth.api';

const protectedRoutes = ['/dashboard']

export default async function middleware(req: NextRequest) {
  const currentRoute = req.nextUrl.pathname;
  const shouldProtect = protectedRoutes.includes(currentRoute)
  const authCookie = req.cookies.get('auth')
  if (shouldProtect) {
    if (!authCookie) return NextResponse.redirect(getAbsolutePath('/'))
  }

}
//This middleware will only run for protected routes
export const config = {
  matcher: ['/dashboard']
};