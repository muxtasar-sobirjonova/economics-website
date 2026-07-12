export const splitTitle = (title: string) => {
  if (title === "What Is Entrepreneurship Economics?")
    return ["What Is Entrepreneurship", "Economics?"];
  if (title === "Problems, Opportunities, and Value")
    return ["Problems, Opportunities,", "and Value"];
  if (title === "Why Some Businesses Scale While Others Don't")
    return ["Why Some Businesses", "Scale While Others Don't"];
  if (title === "Profit, Incentives, and Decision-Making")
    return ["Profit, Incentives, and", "Decision-Making"];
  const words = title.split(" ");
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
};
