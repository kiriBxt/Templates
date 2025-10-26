export const cookieValidator = async (req, res) => {
  const cookieName = process.env.COOKIE_NAME;
  const cookie = req.cookies[cookieName];

  if (!cookie) return;

  const unsignedCookie = res.unsignCookie(cookie);
  if (!unsignedCookie.valid) {
    res.clearCookie(cookieName);
    throw new Error("Cookie has been tampered with!", { cause: 403 });
  }
  req.user_id = unsignedCookie.value;
};
