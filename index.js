const str = 'some value';

function fn () {
    console.log('some log');
}

console.log(str);
fn();

fn(2);

const add = (a, b) => {
    if (typeof a === 'number' && typeof b === 'number') {
        return a + b;
    }
    return NaN;
};

add(2, 3);

module.exports = {
    add
};
