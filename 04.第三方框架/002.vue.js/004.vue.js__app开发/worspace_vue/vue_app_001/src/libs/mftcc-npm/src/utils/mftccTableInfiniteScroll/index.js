// directive
import mftccTableScroll from './mftccTableScroll';

// Vue.use()
// mftccTableScroll.install = (Vue) => {
//   Vue.directive('mftcc-table-infinite-scroll', mftccTableScroll);
// };
Vue.directive("mftcc-table-infinite-scroll", mftccTableScroll);

// Vue.component()
export default mftccTableScroll;