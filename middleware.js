import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export default withAuth(async function middleware(req) {
  // Manager rolünde izin verilen sayfalar
  const allowedManagerPaths = ["", "dashboard", "dashboard/personal"];
  // Personal rolünde izin verilen sayfalar
  const allowedPersonalPaths = [
    "",
    "*",
    "dashboard",
    "dashboard/stock",
    "dashboard/stock-control",
  ];

  // Kullanıcının bilgisi alınır.
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Sayfanın URL'ini alıyoruz, ve izin verdiğimiz path ile eşleşip eşleşmediğini kontrol ediyoruz.
  const currentPath = req.nextUrl.pathname;
  if (!session) {
    // Kullanıcının giriş yapıp yapmadığını kontrol ediyoruz.
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/sign-in`);
  }

  // // Eğer rolü manager ise ama sayfaya erişimi yoksa dashboard'a yönlendiriyoruz.
  // if (
  //   session.user.role == 'manager' &&
  //   !allowedManagerPaths.some((path) => currentPath === `/${path}`)
  // ) {
  //   return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard`);
  // }

  // // Eğer rolü personal ise ama sayfaya erişimi yoksa dashboard'a yönlendiriyoruz.
  // if (
  //   (session.user.role =
  //     'personal' &&
  //     !allowedPersonalPaths.some((path) => currentPath === `/${path}`))
  // ) {
  //   return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard`);
  // }
});

//https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/createProduct/:path*",
    "/financialManagement",
    "/createOffer",
  ],
};
