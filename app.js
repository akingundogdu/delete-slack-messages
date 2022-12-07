const {WebClient} = require('@slack/web-api');

console.log('Getting started to clear your slack messages');

const deleteSlackMessages = async () => {
    console.log('deleted slack message xxxx ');
};


(async () => {
    await deleteSlackMessages();
    console.log('done!');
})();
