const { User, Chat, UserChat, sequelize, Message, Asset } = require('../../models');
const routeHandler = require('../../utils/routeHandler');
const { validateNullParameters, validateTrue, findModelOrThrow, findModelAndThrow, } = require('../../utils/validation');
const { STATUS_CODE } = require('../../utils/constants');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { sendAppError } = require('../../utils/AppError');

const waitDelay = (delay) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), delay)
    });
}

// const createGroupTest = async () => {
//     console.log(`getChat Start`);
//     const user_id_1 = 'd64f14b2-d0d8-490f-8996-043ee66fb58b';
//     const user_id_2 = '792a0e19-ae18-4d12-8a92-0dc4f04c8086';
//     const user_id_3 = '5b526d0e-c669-4678-a2e6-08572a575d50';

//     const user1 = await User.findOne({
//         where: {
//             user_id: user_id_1,
//         },
//     });

//     const user2 = await User.findOne({
//         where: {
//             user_id: user_id_2,
//         },
//     });

//     const user3 = await User.findOne({
//         where: {
//             user_id: user_id_3,
//         },
//     });
//     const chat = await Chat.create({
//         name: 'Test Group',
//         type: 'GROUP',
//     });

//     await chat.addAdmin(user1);
//     await chat.addMember(user2);

//     const fs = require('fs');
//     fs.writeFileSync('chat.json', JSON.stringify(chat));

//     await chat.reload({
//         include: [
//             {
//                 model: User,
//                 as: 'admins',
//             },
//             {
//                 model: User,
//                 as: 'members',
//             },
//         ],
//     });

//     fs.writeFileSync('chatReload.json', JSON.stringify(chat));
// }
// createGroupTest();

const create = routeHandler(async (req, res, extras) => {
    const { body: { name, type }, file } = req;
    const { user_id } = req.auth;

    validateTrue(['SINGLE', 'GROUP'].includes(type));

    if (type == 'GROUP') {
        validateNullParameters([name, file]);

        const chat = await Chat.create({
            name,
            type: 'GROUP',
            image: {
                data: file.buffer,
                mimetype: file.mimetype,
            }
        }, {
            include: [
                {
                    model: Asset,
                    as: 'image',
                }
            ],
            transaction: extras.transaction,
        });

        // console.log(`chat`, chat.toJSON());

        await chat.setAdmins(req.auth, { transaction: extras.transaction });

        await chat.reload({
            include: [
                {
                    model: Asset,
                    as: 'image',
                },
                {
                    model: User,
                    as: 'admins',
                },
                {
                    model: User,
                    as: 'members',
                },
            ],
            transaction: extras.transaction,
        });

        await extras.transaction.commit();

        return res.sendRes(chat, { message: 'Chat group created successfully', status: STATUS_CODE.OK, });
    }
    else if (type == 'SINGLE') {
        // validateNullParameters([ file]);

        const chat = await Chat.create({
            name,
            type: 'GROUP',
            image: {
                data: file.buffer,
                mimetype: file.mimetype,
            }
        }, {
            include: [
                {
                    model: Asset,
                    as: 'image',
                }
            ],
            transaction: extras.transaction,
        });

        await chat.setAdmin(req.auth, { transaction: extras.transaction });

        await chat.reload({
            include: [
                {
                    model: User,
                    as: 'admins',
                },
                {
                    model: User,
                    as: 'members',
                },
            ],
        });

        return res.sendRes(chat, { message: 'Chat created successfully', status: STATUS_CODE.OK, });
    }
});

const getAll = routeHandler(async (req, res, extras) => {
    const { user_id } = req.auth;

    const user = await findModelOrThrow({ user_id }, User, {
        include: [
            {
                model: Chat,
                as: 'chats',
                through: { as: 'userChat' },
                include: [
                    {
                        model: Asset,
                        as: 'image',
                    },
                ],
            },
        ],
    }, { throwOnDeleted: true });

    return res.sendRes(user.chats, { message: 'Chats loaded successfully', status: STATUS_CODE.OK, });
}, false);

const getById = routeHandler(async (req, res, extras) => {
    const { chat_id } = req.params;

    const chat = await findModelOrThrow({ chat_id }, Chat, {
        include: [
            {
                model: Asset,
                as: 'image',
            },
            {
                model: User,
                as: 'users',
            },
            {
                model: Message,
                as: 'messages',
                include: [
                    {
                        model: User,
                        as: 'user',
                        include: [
                            {
                                model: Asset,
                                as: 'image',
                            },
                        ],
                    },
                ],
            },
        ],
    }, { throwOnDeleted: true, });

    return res.sendRes(chat, { message: 'Chat found', status: STATUS_CODE.OK, });
}, false);

const addUser = routeHandler(async (req, res, extras) => {
    // const { chat_id } = req.params;
    const { user_id, chat_id } = req.body;

    const chat = await findModelOrThrow({ chat_id, type: 'GROUP' }, Chat, {}, {
        throwOnDeleted: true,
        messageOnNotFound: "Group chat not found",
    });
    const user = await findModelOrThrow({ user_id }, User, {}, { throwOnDeleted: true });
    await findModelAndThrow({ user_id, chat_id }, UserChat, {
    }, {
        messageOnFound: "User already in this chat",
    });

    await chat.addMember(user, { transaction: extras.transaction });
    await extras.transaction.commit();

    return res.sendRes(null, { message: 'User added to chat successfully', status: STATUS_CODE.OK, });
});

const removeUser = routeHandler(async (req, res, extras) => {
    // const { chat_id } = req.params;
    const { user_id, chat_id } = req.body;

    const chat = await findModelOrThrow({ chat_id, type: 'GROUP' }, Chat, {}, {
        throwOnDeleted: true,
        messageOnNotFound: "Group chat not found",
    });
    const user = await findModelOrThrow({ user_id }, User, {}, { throwOnDeleted: true });
    await findModelOrThrow({ user_id, chat_id }, UserChat, {
    }, {
        messageOnNotFound: "User not found in this chat",
    });

    await chat.removeUser(user, { transaction: extras.transaction });
    await extras.transaction.commit();

    return res.sendRes(null, { message: 'User removed from chat successfully', status: STATUS_CODE.OK, });
});

// const updateById = routeHandler(async (req, res, extras) => {
//     const { user_id } = req.params;

//     const {
//         body: {
//             username,
//             mobile_no,
//             email,
//             first_name,
//             last_name,
//             password,
//             password_confirm,
//         },
//         file
//     } = req;

//     extras.setErrorCallback(() => {
//         if (file) {
//             file => util.deleteFile(file.path);
//         }
//     })

//     isEmptyStringParameters([username, mobile_no, email, first_name, password, password_confirm]);

//     if (password && password !== password_confirm) {
//         return sendAppError(extras, "Passwords not match!", STATUS_CODE.BAD_REQUEST);
//     }

//     const user = await findModelOrThrow({ user_id }, User, {
//         include: {
//             model: Asset,
//             as: 'profile',
//         }
//     });

//     await user.update({
//         username,
//         mobile_no,
//         email,
//         first_name,
//         last_name,
//         password,
//     });

//     const profile = await user.getProfile();

//     if (file && profile) {
//         await profile.update({
//             name: file.filename,
//         }, { transaction: extras.transaction, })
//     }
//     else if (file) {
//         await Asset.create({
//             owner_id: user.user_id,
//             name: file.filename,
//             asset_type: 'user_profile',
//         }, { transaction: extras.transaction, })
//     }

//     await extras.transaction.commit();

//     // reload user with profile
//     return res.sendRes(user, {
//         message: 'User updated successfully',
//         status: STATUS_CODE.OK,
//     });
// })

// const deleteById = routeHandler(async (req, res, extras) => {
//     const { user_id } = req.params;

//     const user = await findModelOrThrow({ user_id }, User);
//     await user.destroy({ transaction: extras.transaction });
//     await extras.transaction.commit();
//     return res.sendRes(null, {
//         message: 'User deleted successfully',
//         status: STATUS_CODE.OK,
//     });
// })

module.exports = {
    create,
    getAll,
    getById,
    addUser,
    removeUser,
}