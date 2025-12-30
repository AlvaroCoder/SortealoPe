const URL_UPLOAD_USER_IMAGE = process.env.UPLOAD_USER_IMAGE;
const URL_UPLOAD_IMAGE = process.env.UPLOAD_IMAGE;

export async function UploadUserImage(idUser,token, image) {
    return await fetch(`${URL_UPLOAD_USER_IMAGE}${idUser}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        mode: 'cors',
        body: image
    });
    
};

export async function UploadImage(token, image) {
    return await fetch(URL_UPLOAD_IMAGE, {
        method: 'POST',
        headers: {
            'Authorization' : `Bearer ${token}`
        },
        mode : 'cors',
        body : image
    })
}