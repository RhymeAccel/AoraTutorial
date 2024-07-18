import { Client, Account, ID, Avatars, Databases, Storage, Query } from "react-native-appwrite";

export const config ={
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.jsm.aora",
    projectId: "66917aeb000f738ebaa3",
    databaseId: "66917bce00281995a1cb",
    userCollectionId: "66917be100125c11d9dc",
    videoCollectionId: "66917bf80002b6ca0029",
    storageId: "66917ce10019e368b213"
}

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.
;

const account = new Account(client);
const avatars = new Avatars(client);
const dbs = new Databases(client);
const storage = new Storage(client)

export const createUser = async (email, password, username) => {
    try{
        const newAccount = await account.create(ID.unique(), email, password, username)
        if (!newAccount) throw Error;

        const avatarURL = avatars.getInitials(username)
        await signIn(email, password)

        const newUser = await dbs.createDocument(config.databaseId, config.userCollectionId, ID.unique(), 
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarURL
            }
        )
        return newUser;
    } catch (error){
        console.log(error);
        throw new Error(error);
    }
}

export const signIn = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export const getCurrentUser = async () => {
    try {
        const currAccount = await account.get();

        if (!currAccount) throw Error;

        const currUser = await dbs.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal("accountId", currAccount.$id)]
        )

        if(!currUser) throw Error
        return currUser.documents[0];
    } catch (error) {
        console.log(error)
    }
}

export const getAllPosts = async () => {
    try {
        const posts = await dbs.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.orderDesc("$createdAt")]
        )

        return posts.documents
    } catch (error) {
        throw new Error(error)
    }
}

export const getLatestPost = async () => {
    try {
        const posts = await dbs.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.orderDesc("$createdAt", Query.limit(7))]
        )

        return posts.documents
    } catch (error) {
        throw new Error(error)
    }
}

export const searchPost = async (query) => {
    try {
        const posts = await dbs.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.search("title", query)]
        )

        return posts.documents
    } catch (error) {
        throw new Error(error)
    }
}

export const getUserPosts = async (userId) => {
    try {
        const posts = await dbs.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.equal("creator", userId)]
        )

        return posts.documents
    } catch (error) {
        throw new Error(error)
    }
}

export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');
        return session
    } catch (error) {
        throw new Error(error)
    }
}

export const getFilePreview = async (fileId, type) => {
    let fileUrl
    try {
        if(type==='video'){
            fileUrl = storage.getFileView(config.storageId, fileId)
        } else if(type==='image'){
            fileUrl = storage.getFilePreview(config.storageId, fileId, 2000, 2000, 'top', 100)
        } else {
            throw new Error('Invalid file type')
        }

        if(!fileUrl) throw Error;
        return fileUrl
    } catch (error) {
        throw new Error(error);
    }

}

export const uploadFile = async (file, type) => {
    if(!file) return;

    const {mimeType, ...rest} = file;
    const asset = { type:mimeType, ...rest}

    try {
        const uploadedFile = await storage.createFile(
            config.storageId,
            ID.unique(),
            asset
        )
        const fileUrl = await getFilePreview(uploadedFile.$id, type);
        return fileUrl
    } catch (error) {
        throw new Error(error)
    }
}

export const createVideo = async (form) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video')
        ])
        const newPost = await dbs.createDocument( config.databaseId, config.videoCollectionId, ID.unique(), {
            title: form.title,
            thumbnail: thumbnailUrl,
            video: videoUrl,
            prompt: form.prompt,
            creator: form.userId
        })
        return newPost
    } catch (error) {
        throw new Error(error)
    }

}