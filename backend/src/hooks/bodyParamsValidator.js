export const bodyParamsValidator = async (req, res) => {
  const bodyParams = req.routeOptions.config.bodyParams;

  if (!bodyParams) return;

  if (bodyParams.length > 0)
    bodyParams.forEach((element) => {
      console.log(req.body);
      if (!req.body[element])
        throw new Error(`Missing req.body parameter: ${bodyParams}`, {
          cause: 400,
        });
    });
};
