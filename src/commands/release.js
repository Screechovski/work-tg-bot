import { Markup } from "telegraf";
import { Release, User } from "~/db/models.ts";
import { getLines } from "~/helper/getLines";
import { TASK_REGEXP } from "~/helper/constants";

export async function releaseHandler(ctx) {
  const user = await User.findOne({ where: { tgId: ctx.message.from.username } });
  const lines = getLines(ctx.message.text).slice(1);
  const projects = ["витрина", "crm", "admin", "promo"];

  if (lines.length < 2) {
    throw new Error("некорректная структура сообщения");
  }

  let projectId = null;

  for (const line of lines) {
    if (projects.indexOf(line) !== -1) {
      projectId = projects.indexOf(line);
      continue;
    }
    if (!TASK_REGEXP.test(line)) {
      continue;
    }
    if (await Release.findOne({ where: { link: line } })) {
      ctx.reply(`${line} уже в релизе`);
    }
    await Release.create({
      projectId,
      link: line,
      writed: 0,
      released: 0,
      ownerId: user.id,
    });
  }
}

function getReleasesStruct(releases) {
  const sum = {};

  for (const release of releases) {
    if (!sum[release.projectId]) {
      sum[release.projectId] = {};
    }
    if (!sum[release.projectId][release.ownerId]) {
      sum[release.projectId][release.ownerId] = [];
    }
    sum[release.projectId][release.ownerId].push({
      link: release.link,
      writed: release.writed,
    });
  }

  return sum;
}

export async function releaseListHandler(ctx) {
  const releases = await Release.findAll({ where: { released: 0 } });

  if (releases.length === 0) {
    ctx.reply(`В релизе нет задач`, {
      reply_to_message_id: ctx.message.message_id,
    });
    return;
  }

  const sum = getReleasesStruct(releases);

  const projects = ["витрина", "crm", "admin", "promo"];

  for (const projectId of Object.keys(sum)) {
    await ctx.sendMessage(projects[projectId]);

    for (const userId of Object.keys(sum[projectId])) {
      const user = await User.findByPk(userId);
      await ctx.sendMessage(`@${user.tgId}`);

      for (const releaseStruct of sum[projectId][userId]) {
        const buttons = [
          Markup.button.callback("👍", "like_release"),
          Markup.button.callback("❗️", "tag_release"),
          Markup.button.callback("❌", "cancel_release"),
        ];

        if (releaseStruct.writed === 0) {
          buttons.unshift(Markup.button.callback("✍🏻", "write_release"));
        }

        await ctx.sendMessage(releaseStruct.link, {
          reply_markup: {
            inline_keyboard: [buttons],
          },
        });
      }
    }
  }
}

export async function writeReleaseListener(ctx) {
  const callbackQuery = ctx.update.callback_query;
  await ctx.answerCbQuery();
  const release = await Release.findOne({ where: { link: callbackQuery.message.text } });

  if (!release) {
    // err
  }

  release.writed = 1;

  release.save();

  const buttons = [
    Markup.button.callback("👍", "like_release"),
    Markup.button.callback("❗️", "tag_release"),
    Markup.button.callback("❌", "cancel_release"),
  ];

  await ctx.editMessageText(release.link, { reply_markup: { inline_keyboard: [buttons] } });
}

export async function likeReleaseListener(ctx) {
  const callbackQuery = ctx.update.callback_query;

  await ctx.answerCbQuery();

  const release = await Release.findOne({ where: { link: callbackQuery.message.text } });

  if (!release) {
    // err
  }

  release.released = 1;

  await release.save();

  await ctx.editMessageText(release.link);
  await ctx.react("💯");
}

export async function tagReleaseListener(ctx) {
  const callbackQuery = ctx.update.callback_query;

  await ctx.answerCbQuery();

  const release = await Release.findOne({ where: { link: callbackQuery.message.text } });

  if (!release) {
    // throw err;
  }

  const owner = await User.findByPk(release.ownerId);

  if (!owner) {
    // throw err;
  }

  await ctx.sendMessage(`@${owner.tgId}\n залей пожалуйста задачу ${release.link}`);
}

export async function cancelReleaseListener(ctx) {
  const callbackQuery = ctx.update.callback_query;
  const messageId = callbackQuery.message.message_id;

  await ctx.answerCbQuery();
  await ctx.deleteMessage(messageId);
}
