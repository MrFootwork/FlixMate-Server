module.exports = {
  set: {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
    partitioned: true,
    maxAge: 1000 * 60 * 60 * 12,
  },
  clear: {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
    partitioned: true,
  },
}
