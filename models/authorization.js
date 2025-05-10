import { UnauthorizedError } from "@/errors";

function canRequest(features) {
  return function (request, response, next) {
    const user = request.context.user;

    const hasPermission = features.some((feature) =>
      user.features.includes(feature),
    );

    if (!hasPermission) {
      throw new UnauthorizedError({
        message: "O usuário não pode executar a operação requisitada.",
        action: `Verifique se o usuário possui algumas das seguintes permissões: "${features.join('", "')}".`,
      });
    }

    return next();
  };
}

const authorization = {
  canRequest,
};

export default authorization;
