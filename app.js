const {WebClient} = require('@slack/web-api');

const token = 'your_slack_app_user_auth_token';
const channelId = 'your_channel_id_that_you_want_to_delete';
const myUserId = 'your_user_id';
const slackClient = new WebClient(token);
console.log('Getting started to clear your slack messages');

const deleteSlackMessages = async () => {
    console.log('deleted slack message xxxx ');
};

const getMessagesFromSlack = async ({ slackClient, channelId, myUserId }) => {
    const conversationHistories = await slackClient.conversations.history({
        channel: channelId,
        limit: 1000,
        // latest: '1618827164.002200',
    });
    console.log('conversationHistories.messages.length', conversationHistories.messages.length);
    const list = conversationHistories.messages.map((message) => {
        return message.user === myUserId;
    });
    console.log('my.conversationHistories.messages.length', list.length);

    return list;
}


(async () => {
    const messages = await getMessagesFromSlack({ slackClient, channelId, myUserId })
    await deleteSlackMessages(messages);
    console.log('done!');
})();
