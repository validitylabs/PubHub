// tslint:disable-next-line
const Ipfs = require('ipfs');

const options = {
    repo: 'ipfs-' + String(Math.random() + Date.now()),
    config: {
        Addresses: {
            API: '/ip4/127.0.0.1/tcp/5001',
            Gateway: '/ip4/127.0.0.1/tcp/8080'
        },
        API: {
            HTTPHeaders: {
                'Access-Control-Allow-Methods': ['PUT', 'GET', 'POST'],
                'Access-Control-Allow-Origin': ['http://127.0.0.1:5001', 'https://webui.ipfs.io']
            }
        }
    }
};

export const node = new Ipfs(options);

// Add and retrive content from IPFS
export const addToIpfs = async (title: String, text: String) => {
    const textToBeAdded = `Going to add title ${title} and text ${text}`;
    console.log(textToBeAdded);
    const files = [
        {
            path: '/tmp/myfile.txt',
            content: Ipfs.Buffer.from(textToBeAdded)
        }
    ];

    const filesAdded = await node.add(files);
    console.log(' [ ipfs add ] Added file:', filesAdded);

    // try to retrieve both hashes now
    const fileBuffer = await node.cat(filesAdded[1].hash); //filesAdded[0].hash
    console.log('[ ipfs retrieve ] Content from hash:', fileBuffer.toString());
    const directoryFile = await filesAdded.find((f: any) => f.path === 'tmp');
    const directoryBuffer = await node.cat(`/ipfs/${directoryFile.hash}/myfile.txt`);
    console.log('[ ipfs retrieve ] Content from dir:', directoryBuffer.toString());
};

export const initializeIpfs = () => {
    console.log(' [ initialize ipfs ] Online status: ', node.isOnline() ? 'online' : 'offline');
    node.once('ready', () => {
        console.log(' [ initialize ipfs ] IPFS node is ready');
        node.swarm.connect(
            '/ip4/127.0.0.1/tcp/4003/ws/ipfs/QmVJQDXoLqfBpBwBVmi96zbuD3eQazQf274EEwLB6BNWaZ',
            // This information is in align with the daemon. Connecting through websocket by the hash. Config could be found and set at "~/.ipfs/config"
            (err: any) => {
                if (err) {
                    throw err;
                }
                // if no err is present, connection is now open
                console.log(' [ initialize ipfs ] Websocket connection is added');
                node.id((err: any, res: any) => {
                    if (err) {
                        throw err;
                    }
                    console.log(' [ initialize ipfs ]  The node identity is: ', res);
                    node.config.get((err: any, config: any) => {
                        if (err) {
                            throw err;
                        }
                        console.log(' [ initialize ipfs ] The node config is: ', config);
                    });
                });
            }
        );
    });
    node.once('error', (error: any) => {
        console.error('Something went terribly wrong!', error);
    });
    node.once('start', () => console.log('Node started!'));
};