// tslint:disable-next-line
const {Client} = require('@elastic/elasticsearch');

export const client = new Client({
    node:'http://localhost:9200'
});

// client.info(console.log)

// export const search = async (_title: String, _text: String) => {
//     const result = await client.search()
// }

// const result = await client.search({
//     index: 'my-index',
//     body: { foo: 'bar' }
//   })