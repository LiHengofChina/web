import * as openpgp from 'openpgp';

// 使用公钥加密数据
export async function encryptWithPublicKey(data, pgpPublicKey) {
    try {

        // 读取公钥
        const publicKey = await openpgp.readKey({ armoredKey: pgpPublicKey }); //cv25519

        // 创建待加密的消息，直接传递 data 对象
        const message = await openpgp.createMessage({ text: data });

        // 加密数据
        const encrypted = await openpgp.encrypt({
            message, // 待加密的信息
            encryptionKeys: publicKey, // 加密使用的公钥
        });

        return encrypted;  // 返回加密后的数据

    } catch (error) {
        console.error('加密过程中发生错误: ', error);
        throw new Error('加密失败');
    }
}
