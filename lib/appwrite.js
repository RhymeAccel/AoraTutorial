import { Client, Account, ID, Avatars, Databases } from "react-native-appwrite";
import { Query } from "react-native-appwrite";

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
            config.videoCollectionId
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