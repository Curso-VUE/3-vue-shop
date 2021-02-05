export function totalCost(state) {
  return state.cart.reduce((acc, product) => {
    return acc + parseFloat(product.price) * product.qty
  }, 0);
}