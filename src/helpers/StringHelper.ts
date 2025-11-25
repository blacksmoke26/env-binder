/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @copyright 2025 Junaid Atari
 * @see https://github.com/blacksmoke26
 */

/**
 * A utility class that provides static methods for string manipulation and validation.
 * This class cannot be instantiated and all methods are intended to be used statically.
 */
export default abstract class StringHelper {
  /**
   * Converts a value of any type to a string representation.
   * Objects and functions are converted to empty strings.
   *
   * @param val - The value to be converted to a string
   * @param trim - Whether to trim whitespace from the resulting string. Default is false
   * @returns The string representation of the input value
   *
   * @example
   * ```typescript
   * StringHelper.toString(123); // "123"
   * StringHelper.toString(null); // ""
   * StringHelper.toString("  hello  ", true); // "hello"
   * StringHelper.toString({}, true); // ""
   * ```
   */
  public static toString(val: unknown, trim: boolean = false): string {
    const str = ['object', 'function', 'symbol'].includes(typeof val) ? '' : String(val || '');

    return trim ? str.trim() : str;
  }

  /**
   * Determines whether the specified value is null, undefined, or an empty string.
   *
   * @param val - The value to test for null or emptiness
   * @returns true if the value is null, undefined, or an empty string; otherwise, false
   *
   * @example
   * ```typescript
   * StringHelper.isNullOrEmpty(null); // true
   * StringHelper.isNullOrEmpty(""); // true
   * StringHelper.isNullOrEmpty(" "); // false
   * StringHelper.isNullOrEmpty("hello"); // false
   * ```
   */
  public static isNullOrEmpty(val: unknown): boolean {
    return !val || !StringHelper.toString(val).length;
  }

  /**
   * Determines whether the specified value is null, undefined, empty, or contains only whitespace characters.
   *
   * @param val - The value to test for null, emptiness, or whitespace
   * @returns true if the value is null, undefined, empty, or whitespace-only; otherwise, false
   *
   * @example
   * ```typescript
   * StringHelper.isNullOrWhitespace(null); // true
   * StringHelper.isNullOrWhitespace(""); // true
   * StringHelper.isNullOrWhitespace(" "); // true
   * StringHelper.isNullOrWhitespace("\t\n"); // true
   * StringHelper.isNullOrWhitespace("hello"); // false
   * ```
   */
  public static isNullOrWhitespace(val: unknown): boolean {
    return !val || !StringHelper.toString(val, true).length;
  }
}
