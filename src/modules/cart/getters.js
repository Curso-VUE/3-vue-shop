export function totalCost(state) {
  return state.cart.reduce((acc, product) => {
    return parseFloat(acc + parseFloat(product.price) * product.qty).toFixed(2)
  }, 0);
}