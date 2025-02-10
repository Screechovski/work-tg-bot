export async function poslanieHandler(ctx) {
  const from = ctx.message.from.username;
  let to = "marallada";

  if (from == "marallada") {
    to = "dmyavl";
  }

  ctx.sendMessage(`@${to}, пользователь @${from}, просил передать, что очень любит вас`);
}
