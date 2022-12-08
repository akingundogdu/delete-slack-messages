const { WebClient } = require('@slack/web-api');

const token = 'your_slack_app_user_auth_token';
const channelId = 'your_channel_id_that_you_want_to_delete';
const myUserId = 'your_user_id';
const slackClient = new WebClient(token);

console.log('Getting started to clear your slack messages');

const sleep = (ms = 1500) => {
  return new Promise((r) => {
    return setTimeout(r, ms);
  });
};

const deleteReplies = async ({ ts }) => {
  const replies = await slackClient.conversations.replies({
    channel: channelId,
    limit: 1000,
    ts,
  });

  if (replies.messages.length > 0) {
    console.log(`Reply count for ${ts}`, replies.messages.length);

    for await (let reply of replies.messages) {
      try {
        if (reply.user === myUserId) {
          await sleep();

          await slackClient.chat.delete({ channel: channelId, ts: reply.ts });
        }
      } catch (error) {
        console.log('There was a problem when deleting reply message', error?.data?.error || error.message);
      }
    }
  }

  return Promise.resolve(replies);
};

const deleteSlackMessages = async (messages) => {
  for await (let message of messages) {
    try {
      await deleteReplies({ ts: message.ts });

      if (message.user === myUserId) {
        await sleep();
        await slackClient.chat.delete({ channel: channelId, ts: message.ts });

        console.log('The slack message deleted ', message.ts);
      }
    } catch (error) {
      console.log('There was a problem to delete processing', error?.data?.error || error.message);
    }
  }
};

const getConversationHistoriesFromSlack = async ({ latest = null }) => {
  const conversationHistories = await slackClient.conversations.history({
    channel: channelId,
    limit: 1,
    latest,
  });

  return Promise.resolve({
    messages: conversationHistories.messages,
    hasMore: conversationHistories.has_more,
    latest: conversationHistories.messages[conversationHistories.messages.length - 1].ts,
  });
}


(async () => {
  try {
    let latest = null;
    let hasMore = true; //after completing the delete process for all slack messages, this will stop.

    do {
      console.log(latest ? 'Clean process continue...' : '');

      const conversation = await getConversationHistoriesFromSlack({ latest });
      console.log('Slack message count', conversation.messages.length);

      latest = conversation.latest;
      hasMore = conversation.hasMore;
      await deleteSlackMessages(conversation.messages);

    } while (hasMore);
  } catch (error) {
    console.error(error);
  }
  console.log('Done!');
})();
