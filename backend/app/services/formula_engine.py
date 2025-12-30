"""Formula engine for safe expression evaluation"""
from typing import Dict, Any, List, Optional
import math
from simpleeval import simple_eval, NameNotDefined, InvalidExpression


class FormulaEngine:
    """Safe formula evaluation engine"""

    # Safe functions that can be used in formulas
    SAFE_FUNCTIONS = {
        # Math functions
        'abs': abs,
        'round': round,
        'min': min,
        'max': max,
        'sum': sum,
        'len': len,
        'pow': pow,
        'sqrt': math.sqrt,
        'ceil': math.ceil,
        'floor': math.floor,

        # Financial functions
        'npv': lambda rate, cashflows: sum(cf / (1 + rate) ** i for i, cf in enumerate(cashflows)),
        'pmt': lambda rate, nper, pv: pv * (rate * (1 + rate) ** nper) / ((1 + rate) ** nper - 1),

        # Utility functions
        'avg': lambda lst: sum(lst) / len(lst) if lst else 0,
        'range': range,
    }

    @classmethod
    def evaluate(cls, formula: str, variables: Dict[str, Any]) -> Any:
        """
        Safely evaluate a formula with given variables.

        Args:
            formula: The formula string (e.g., "annual_cost * 12")
            variables: Dictionary of variable values (e.g., {"annual_cost": 1000})

        Returns:
            Calculated result

        Raises:
            ValueError: If formula is invalid or variables are missing
        """
        try:
            result = simple_eval(
                formula,
                names=variables,
                functions=cls.SAFE_FUNCTIONS
            )
            return result
        except NameNotDefined as e:
            raise ValueError(f"Variable not defined: {e}")
        except InvalidExpression as e:
            raise ValueError(f"Invalid formula: {e}")
        except ZeroDivisionError:
            raise ValueError("Division by zero in formula")
        except Exception as e:
            raise ValueError(f"Formula evaluation error: {str(e)}")

    @classmethod
    def validate_formula(cls, formula: str, expected_variables: List[str]) -> bool:
        """
        Validate a formula without executing it.

        Args:
            formula: The formula string
            expected_variables: List of variable names that should be available

        Returns:
            True if valid, raises ValueError if invalid
        """
        # Test with dummy values
        test_vars = {var: 1 for var in expected_variables}

        try:
            cls.evaluate(formula, test_vars)
            return True
        except Exception as e:
            raise ValueError(f"Formula validation failed: {str(e)}")

    @classmethod
    def extract_variables(cls, formula: str) -> List[str]:
        """
        Extract variable names used in a formula.

        This is a simple implementation that looks for word characters.
        More sophisticated parsing could be added later.
        """
        import re
        # Find all word sequences that aren't function names
        words = re.findall(r'\b[a-zA-Z_][a-zA-Z0-9_]*\b', formula)

        # Filter out function names
        variables = [w for w in words if w not in cls.SAFE_FUNCTIONS]

        return list(set(variables))

    @classmethod
    def calculate_roi_metrics(cls, inputs: Dict[str, Any], formulas: Dict[str, str]) -> Dict[str, Any]:
        """
        Calculate all metrics based on inputs and formulas.

        Args:
            inputs: User input values
            formulas: Dictionary of formula definitions

        Returns:
            Dictionary of calculated results
        """
        results = {}
        variables = inputs.copy()

        # Evaluate formulas in order (some may depend on previous results)
        # Simple dependency resolution: try multiple passes
        max_passes = 10
        remaining_formulas = formulas.copy()

        for _ in range(max_passes):
            if not remaining_formulas:
                break

            evaluated_this_pass = []

            for formula_name, formula_expr in list(remaining_formulas.items()):
                try:
                    result = cls.evaluate(formula_expr, variables)
                    results[formula_name] = result
                    variables[formula_name] = result
                    evaluated_this_pass.append(formula_name)
                except ValueError:
                    # Can't evaluate yet, might depend on other formulas
                    continue

            # Remove evaluated formulas
            for name in evaluated_this_pass:
                remaining_formulas.pop(name)

            # If we didn't make progress, we have circular dependencies or errors
            if not evaluated_this_pass:
                break

        # If there are still remaining formulas, they have errors or circular deps
        if remaining_formulas:
            raise ValueError(f"Could not evaluate formulas: {list(remaining_formulas.keys())}")

        return results


# Example usage and tests
if __name__ == "__main__":
    # Test basic formula
    engine = FormulaEngine()

    # Simple calculation
    result = engine.evaluate("annual_calls * cost_per_call", {
        "annual_calls": 100000,
        "cost_per_call": 0.5
    })
    print(f"Total cost: {result}")  # 50000

    # NPV calculation
    result = engine.evaluate("npv(0.1, [1000, 2000, 3000, 4000, 5000])", {})
    print(f"NPV: {result}")

    # Complex formula with dependencies
    formulas = {
        "baseline_cost": "annual_calls * agent_cost_per_min * avg_minutes",
        "ai_cost": "annual_calls * ai_cost_per_min * avg_minutes * (1 - containment)",
        "savings": "baseline_cost - ai_cost",
        "roi": "(savings / ai_cost) * 100"
    }

    inputs = {
        "annual_calls": 100000,
        "agent_cost_per_min": 0.8,
        "ai_cost_per_min": 0.12,
        "avg_minutes": 5,
        "containment": 0.7
    }

    results = engine.calculate_roi_metrics(inputs, formulas)
    print(f"Results: {results}")
