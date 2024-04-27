import type { CSSProperties, ImgHTMLAttributes } from "react";

export interface IIconProps {
  /**
   * The icon id, according to [Unicons](https://iconscout.com/unicons/explore/line), without "uil uil-" section.
   *
   * @Example
   * "cog"
   */
  name?: string;
  /**
   * The icon size.
   *
   * @Default
   * `regular`
   * */
  size?: "small" | "regular" | "medium" | "large";
  /** The icon type: linear or solid
   *
   * @Default
   * `line`
   */
  type?: "line" | "solid";
  /**
   * Icon inline styling properties.
   */
  style?: CSSProperties;

  /**
   * Custom <img /> props to use custom SVG source as icon.
   */
  customSvg?: ImgHTMLAttributes<HTMLOrSVGImageElement>;
}

const Icon = ({
  size = "regular",
  type = "line",
  name,
  style = {},
  customSvg,
}: IIconProps) => {
  const getFontSize = () => {
    switch (size) {
      case "small":
        return "1rem";
      case "medium":
        return "1.5rem";
      case "large":
        return "2rem";
      case "regular":
      default:
        return "1.25rem";
    }
  };

  const getIconType = () => {
    switch (type) {
      case "solid":
        return "uis uis";
      case "line":
      default:
        return "uil uil";
    }
  };

  if (customSvg)
    return (
      <img
        {...customSvg}
        draggable={false}
        alt=""
        style={{
          fontSize: getFontSize(),
          lineHeight: "1rem",
          ...style,
        }}
      />
    );

  return (
    <i
      style={{
        fontSize: getFontSize(),
        lineHeight: "1rem",
        ...style,
      }}
      className={`${getIconType()}-${name}`}
    />
  );
};

export default Icon;
