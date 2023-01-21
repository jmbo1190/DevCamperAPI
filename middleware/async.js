//const asyncHandler = fn => (req, res, next) =>
//    Promise.resolve(fn(req, res, next)).catch(next);

const asyncHandler = (fn) => {
    return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = asyncHandler;