import forge from 'node-forge';

class Encryptor {
    constructor(publicKeyPem, algorithm) {
        this.encryptor = forge.pki.publicKeyFromPem(publicKeyPem);
        this.algorithm = algorithm;
    }

    encryptData(data, keyId) {
        const encryptedData = this.encryptor.encrypt(data, this.algorithm, {
            md: forge.md.sha1.create(),
            mgf1: {
                md: forge.md.sha1.create()
            }
        });
        const base64EncodedData = forge.util.encode64(encryptedData);
        return ["1", keyId, base64EncodedData].join(":");
    }
}

export default Encryptor;