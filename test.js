exports.handler = (event,context,cb) => {
    console.info(process.env);
    cb(null,"Success");
};
