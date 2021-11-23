import {PrismaClient} from '@prisma/client';
import assert from 'assert';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
    // to create a new token use command
    // `php artisan create:token your_address` in backend
    // dummy request with token
    const req = {
        headers: {
            authorization:
                'Bearer 4|GrZjBcKo31BcnrarFzXa1zVOSGwSceQuxZ8bN1z9'
        }
    }
    const token = extractSanctumToken(req)
    assert(token, 'No token was provided');

    const [expectedId, plainToken] = token.split('|');
    console.log(expectedId)
    console.log(plainToken)
    const hashedToken = crypto.createHash('sha256').update(plainToken).digest('hex');
    console.log(hashedToken)
    // expectedHash: d1bad2124490e8edf65c28615d1f6368ea622cd685b928d0dd4a729771520436
    const tokenRow = await prisma.accessToken.findFirst({
        where: {
            tokenable_type: 'App\\Models\\Profile',
            token: hashedToken,
            id: parseInt(expectedId),
        },
    });
    assert(tokenRow, 'The token provided was not recognized');
    console.log(tokenRow);
    //         res.status(200).json({
    //                 "X-Hasura-User-Id": tokenRow.tokenable_id.toString(),
    //                 "X-Hasura-Role": "user"
    //             }
    //         );
}

// export default async function handler(req, res) {
//     try {
//         const token = extractSanctumToken(req)
//         assert(token, 'No token was provided');
//         const [expectedId, plainToken] = token.split('|');
//         const hashedToken = crypto.createHash('sha256').update(plainToken).digest('hex');
//         const tokenRow = await prisma.accessToken.findFirst({
//             where: {
//                 tokenable_type: 'App\\Models\\Profile',
//                 token: hashedToken,
//                 id: parseInt(expectedId),
//             },
//         });
//         assert(tokenRow, 'The token provided was not recognized');
//         res.status(200).json({
//                 "X-Hasura-User-Id": tokenRow.tokenable_id.toString(),
//                 "X-Hasura-Role": "user"
//             }
//         );
//     } catch (e) {
//         res.status(500).send(e.stack || e);
//     } finally {
//         await prisma.$disconnect();
//     }
// }

// const stringify = obj =>
//     JSON.stringify(obj, (_, v) => (typeof v === 'bigint' ? v.toString() : v));

main()
    .catch((e) => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

function extractSanctumToken(req: any) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
}