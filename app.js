const {WebClient} = require('@slack/web-api');

const token = 'your_slack_app_user_auth_token';
const channelId = 'your_channel_id_that_you_want_to_delete';
const myUserId = 'your_user_id';

console.log('Getting started to clear your slack messages');

const deleteSlackMessages = async () => {
    console.log('deleted slack message xxxx ');
};


(async () => {
    //trying to fetch 1000 messages from slack api to delete them
    const result = await client.conversations.history({
        channel: channelId,
        limit: 1000,
        // latest: '1618827164.002200',
    });
    console.log('result.messages', result.messages.length);
    const list = result.messages.map((message) => {
        return message;
    });
    console.log('list', list.length);

    await deleteSlackMessages();
    console.log('done!');
})();
