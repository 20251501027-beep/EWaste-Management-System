async function handleGet(req, res) {
  res.status(200).json({
    success: true,
  });
}

module.exports = {
  handleGet,
};
