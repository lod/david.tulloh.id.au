module.exports = {

  filterByCategory: (posts, cat) => {

	/*
	case matters, so let's lowercase the desired category, cat
	and we will lowercase our posts categories
	*/
	cat = cat.toLowerCase();
	let result = posts.filter(p => {
		let cats = p.data.categories.map(s => s.toLowerCase());
		return cats.includes(cat);
	});
	return result;
}

};
