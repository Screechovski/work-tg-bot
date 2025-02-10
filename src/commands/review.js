import { Op } from "@sequelize/core";
import { Markup } from "telegraf";
import { Review, User } from "~/db/models.ts";
import { getLines } from "~/helper/getLines";
import { getRandom } from "~/helper/getRandom";
import { MR_REGEXP } from "~/helper/constants";
import { getMrLink } from "~/helper/getMrLink";

function getButtons(first = false) {
  const buttons = [Markup.button.callback("✅", "approve_review"), Markup.button.callback("🤾🏻‍♂️", "to_other_review")];

  if (first) {
    buttons.push(Markup.button.callback("✅🤾🏻‍♂️", "approve_onemore_review"));
  }

  buttons.push(Markup.button.callback("❓", "questions_review"));

  return buttons;
}

function getRandomReviewerId(users) {
  const sumK = users.reduce((prev, user) => user.reviewK + prev, 0);
  let randK = getRandom(sumK);

  for (const user of users) {
    randK -= user.reviewK;
    if (randK <= 0) {
      return user.id;
    }
  }
}

function reverseKUsers(users) {
  const maxK = Math.max(...users.map((user) => user.reviewK));
  const minK = Math.max(...users.map((user) => user.reviewK));

  const reverseKUsers = [];

  for (const user of users) {
    reverseKUsers.push({
      id: user.id,
      reviewK: maxK - (user.reviewK - minK),
    });
  }

  return reverseKUsers;
}

async function getReviewerId(excludeIds, first = false) {
  const users = await User.findAll({
    where: {
      id: {
        [Op.notIn]: excludeIds,
      },
    },
  });

  if (first) {
    console.log("first");
    return getRandomReviewerId(reverseKUsers(users));
  } else {
    console.log("second");
    return getRandomReviewerId(users);
  }
}

export async function reviewHandler(ctx) {
  const user = await User.findOne({ where: { tgId: ctx.message.from.username } });

  if (!user) {
    // err
  }

  const lines = getLines(ctx.message.text).slice(1);
  const link = lines.find((line) => MR_REGEXP.test(line));

  if (!link) {
    throw new Error("Ссылка не найдена или имеет другой формат");
  }

  let review = await Review.findOne({
    where: { link },
  });

  let reviewer;
  if (!review) {
    reviewer = await User.findByPk(await getReviewerId([user.id], true));
    // reviewer = await User.findByPk(11);

    review = await Review.create({
      link,
      approved: 0,
      firstReview: 1,
      ownerId: user.id,
      reviewerId: reviewer.id,
    });
  } else {
    reviewer = await User.findByPk(review.reviewerId);
  }

  await ctx.sendMessage(`@${reviewer.tgId} на ревью, пожалуйста\n${link}\n${reviewer.gitId}`, {
    reply_markup: {
      inline_keyboard: [getButtons(review.firstReview === 1)],
    },
  });
}

export async function approveReviewListener(ctx) {
  const callbackQuery = ctx.update.callback_query;
  await ctx.answerCbQuery();
  const link = getMrLink(callbackQuery.message.text);

  if (!link) {
    throw new Error("Не найдена ссылка");
  }

  const review = await Review.findOne({ where: { link } });

  if (!review) {
    throw new Error("Ревью не найден");
  }

  review.approved = 1;

  await review.save();

  const owner = await User.findByPk(review.ownerId);

  if (!owner) {
    throw new Error("Owner не найден");
  }

  await ctx.editMessageText(callbackQuery.message.text);
  await ctx.react("💯");
  await ctx.sendMessage(`@${owner.tgId}, апрув ${review.link}\nМожно отправлять в тест.`);
}

export async function questionReviewListener(ctx) {
  const callbackQuery = ctx.update.callback_query;
  await ctx.answerCbQuery();
  const link = getMrLink(callbackQuery.message.text);

  if (!link) {
    throw new Error("Не удалось спарсить ссылку");
  }

  const review = await Review.findOne({ where: { link } });

  if (!review) {
    throw new Error("ревью не найден в бд");
  }

  const owner = await User.findByPk(review.ownerId);

  if (!owner) {
    throw new Error("Owner не найден");
  }

  await ctx.sendMessage(`@${owner.tgId}, тебе оставили комментарий, посмотри пожалуйста \n${review.link}`, {
    reply_markup: {
      inline_keyboard: [[Markup.button.callback("Поправил", "fixed_review")]],
    },
  });
}

export async function fixedReviewListener(ctx) {
  const callbackQuery = ctx.update.callback_query;
  await ctx.answerCbQuery();
  const link = getMrLink(callbackQuery.message.text);
  const review = await Review.findOne({ where: { link } });
  const reviewer = await User.findByPk(review.reviewerId);
  await ctx.deleteMessage(callbackQuery.message.message_id);
  await ctx.sendMessage(`@${reviewer.tgId}, автор поправил комменты, посмотри пожалуйста \n${review.link}`, {
    reply_markup: {
      inline_keyboard: [getButtons(review.firstReview === 1)],
    },
  });
}

export async function toOtherReviewListener(ctx) {
  const callbackQuery = ctx.update.callback_query;
  const link = getMrLink(callbackQuery.message.text);
  await ctx.answerCbQuery();

  const review = await Review.findOne({ where: { link } });
  const owner = await User.findByPk(review.ownerId);

  if (!review) {
    throw new Error("Ревью не найден");
  }

  const newReviewerId = await getReviewerId([review.reviewerId, owner.id], review.firstReview === 1);
  review.reviewerId = newReviewerId;
  await review.save();

  const reviewer = await User.findByPk(newReviewerId);

  await ctx.sendMessage(`@${reviewer.tgId} на ревью, пожалуйста\n${link}\n${reviewer.gitId}`, {
    reply_markup: {
      inline_keyboard: [getButtons(review.firstReview === 1)],
    },
  });
}
export async function approveOnemoreReviewListener(ctx) {
  const callbackQuery = ctx.update.callback_query;
  const link = getMrLink(callbackQuery.message.text);
  await ctx.answerCbQuery();

  const review = await Review.findOne({ where: { link } });
  const owner = await User.findByPk(review.ownerId);

  if (!review) {
    throw new Error("Ревью не найден");
  }

  const newReviewerId = await getReviewerId([review.reviewerId, owner.id]);
  review.reviewerId = newReviewerId;
  review.firstReview = 0;
  await review.save();

  const reviewer = await User.findByPk(newReviewerId);

  await ctx.sendMessage(`@${reviewer.tgId} на ревью, пожалуйста\n${link}\n${reviewer.gitId}`, {
    reply_markup: {
      inline_keyboard: [getButtons(review.firstReview === 1)],
    },
  });
}
