import RulesUltimate from "./RulesUltimate";
import RulesMelee from "./RulesMelee";

import "../styles/about.css";

const Rules = () => {
  return (
    <>
      <h1 className="sectionTitle">Rules & Policies</h1>
      <RulesUltimate />
      <RulesMelee />
    </>
  );
};

export default Rules;
