import multer from "multer";


const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }, // limitando 2megas para cara upload
});
export { upload };
