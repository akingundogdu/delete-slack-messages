const {WebClient} = require('@slack/web-api');

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

const deleteSlackMessages = async (messages) => {
    for (const index in messages) {
        const message = messages[index];
        try {
            if (message.user === myUserId) {
                await sleep();
                await slackClient.chat.delete({
                    channel: channelId,
                    ts: message.ts,
                });
                console.log('the slack message deleted ', message.ts);
            }
        } catch (error) {
            console.log('there is a problem to delete processing', error.data.error);
        }
    }
};

const getMessagesFromSlack = async ({slackClient, channelId, myUserId}) => {
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
    try {
        let deletedMessagesCount = 0;//after completing the delete process for all slack messages, this will stop.
        do {
            console.log(deletedMessagesCount > 0 ? 'clean process continue...' : '');

            const messages = await getMessagesFromSlack({slackClient, channelId, myUserId})

            console.log('slack messages count', messages.length);

            await deleteSlackMessages(messages);

            deletedMessagesCount = messages.length;
        } while (deletedMessagesCount > 0);
    } catch (error) {
        console.error(error);
    }
    console.log('done!');
})();
