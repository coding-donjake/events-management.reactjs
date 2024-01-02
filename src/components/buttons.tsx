import React, { ReactNode } from "react";

interface ButtonProps {
  type?: "button" | "submit";
  icon?: ReactNode;
  content?: ReactNode;
  hint?: string;
  processing?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export const Button = ({
  type = "button",
  icon,
  content,
  processing,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className="btn hide-in-print"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? (
        <div className="icon">
          {processing ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            icon
          )}
        </div>
      ) : null}
      {content ? <div className="content">{content}</div> : null}
    </button>
  );
};

export const NeutralButton = ({
  type = "button",
  icon,
  content,
  processing,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className="btn btn-neutral"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? (
        <div className="icon">
          {processing ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            icon
          )}
        </div>
      ) : null}
      {content ? <div className="content">{content}</div> : null}
    </button>
  );
};

export const PrimaryButton = ({
  type = "button",
  icon,
  content,
  processing,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className="btn btn-primary"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? (
        <div className="icon">
          {processing ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            icon
          )}
        </div>
      ) : null}
      {content ? <div className="content">{content}</div> : null}
    </button>
  );
};

export const SecondaryButton = ({
  type = "button",
  icon,
  content,
  processing,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className="btn btn-secondary"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? (
        <div className="icon">
          {processing ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            icon
          )}
        </div>
      ) : null}
      {content ? <div className="content">{content}</div> : null}
    </button>
  );
};

export const AccentButton = ({
  type = "button",
  icon,
  content,
  processing,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className="btn btn-accent"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? (
        <div className="icon">
          {processing ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            icon
          )}
        </div>
      ) : null}
      {content ? <div className="content">{content}</div> : null}
    </button>
  );
};

export const GhostButton = ({
  type = "button",
  icon,
  content,
  processing,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className="btn btn-ghost"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? (
        <div className="icon">
          {processing ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            icon
          )}
        </div>
      ) : null}
      {content ? <div className="content">{content}</div> : null}
    </button>
  );
};

export const LinkButton = ({
  type = "button",
  icon,
  content,
  processing,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className="btn btn-link"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? (
        <div className="icon">
          {processing ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            icon
          )}
        </div>
      ) : null}
      {content ? <div className="content">{content}</div> : null}
    </button>
  );
};

export const InfoButton = ({
  type = "button",
  icon,
  content,
  processing,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className="btn btn-info"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? (
        <div className="icon">
          {processing ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            icon
          )}
        </div>
      ) : null}
      {content ? <div className="content">{content}</div> : null}
    </button>
  );
};

export const SuccessButton = ({
  type = "button",
  icon,
  content,
  processing,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className="btn btn-success"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? (
        <div className="icon">
          {processing ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            icon
          )}
        </div>
      ) : null}
      {content ? <div className="content">{content}</div> : null}
    </button>
  );
};

export const WarningButton = ({
  type = "button",
  icon,
  content,
  processing,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className="btn btn-warning"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? (
        <div className="icon">
          {processing ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            icon
          )}
        </div>
      ) : null}
      {content ? <div className="content">{content}</div> : null}
    </button>
  );
};

export const ErrorButton = ({
  type = "button",
  icon,
  content,
  processing,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className="btn btn-error"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? (
        <div className="icon">
          {processing ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            icon
          )}
        </div>
      ) : null}
      {content ? <div className="content">{content}</div> : null}
    </button>
  );
};

export const OutlinedButton = ({
  type = "button",
  icon,
  content,
  processing,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className="btn btn-outline"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? (
        <div className="icon">
          {processing ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            icon
          )}
        </div>
      ) : null}
      {content ? <div className="content">{content}</div> : null}
    </button>
  );
};

export const PrimaryOutlinedButton = ({
  type = "button",
  icon,
  content,
  processing,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className="btn btn-outline btn-primary"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? (
        <div className="icon">
          {processing ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            icon
          )}
        </div>
      ) : null}
      {content ? <div className="content">{content}</div> : null}
    </button>
  );
};

export const SecondaryOutlinedButton = ({
  type = "button",
  icon,
  content,
  processing,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className="btn btn-outline btn-secondary"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? (
        <div className="icon">
          {processing ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            icon
          )}
        </div>
      ) : null}
      {content ? <div className="content">{content}</div> : null}
    </button>
  );
};

export const AccentOutlinedButton = ({
  type = "button",
  icon,
  content,
  processing,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className="btn btn-outline btn-accent"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? (
        <div className="icon">
          {processing ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            icon
          )}
        </div>
      ) : null}
      {content ? <div className="content">{content}</div> : null}
    </button>
  );
};

export const InfoOutlinedButton = ({
  type = "button",
  icon,
  content,
  processing,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className="btn btn-outline btn-info"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? (
        <div className="icon">
          {processing ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            icon
          )}
        </div>
      ) : null}
      {content ? <div className="content">{content}</div> : null}
    </button>
  );
};

export const SuccessOutlinedButton = ({
  type = "button",
  icon,
  content,
  processing,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className="btn btn-outline btn-success"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? (
        <div className="icon">
          {processing ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            icon
          )}
        </div>
      ) : null}
      {content ? <div className="content">{content}</div> : null}
    </button>
  );
};

export const WarningOutlinedButton = ({
  type = "button",
  icon,
  content,
  processing,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className="btn btn-outline btn-warning"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? (
        <div className="icon">
          {processing ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            icon
          )}
        </div>
      ) : null}
      {content ? <div className="content">{content}</div> : null}
    </button>
  );
};

export const ErrorOutlinedButton = ({
  type = "button",
  icon,
  content,
  processing,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className="btn btn-outline btn-error"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? (
        <div className="icon">
          {processing ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            icon
          )}
        </div>
      ) : null}
      {content ? <div className="content">{content}</div> : null}
    </button>
  );
};

export const IconButton = ({
  type = "button",
  icon,
  processing,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className="btn btn-square btn-sm"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? (
        <span className="icon">
          {processing ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            icon
          )}
        </span>
      ) : null}
    </button>
  );
};

export const NeutralIconButton = ({
  type = "button",
  icon,
  processing,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className="btn btn-square btn-sm btn-neutral"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? (
        <span className="icon">
          {processing ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            icon
          )}
        </span>
      ) : null}
    </button>
  );
};

export const PrimaryIconButton = ({
  type = "button",
  icon,
  processing,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className="btn btn-square btn-sm btn-primary"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? (
        <span className="icon">
          {processing ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            icon
          )}
        </span>
      ) : null}
    </button>
  );
};

export const SecondaryIconButton = ({
  type = "button",
  icon,
  processing,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className="btn btn-square btn-sm btn-secondary"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? (
        <span className="icon">
          {processing ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            icon
          )}
        </span>
      ) : null}
    </button>
  );
};

export const AccentIconButton = ({
  type = "button",
  icon,
  processing,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className="btn btn-square btn-sm btn-accent"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? (
        <span className="icon">
          {processing ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            icon
          )}
        </span>
      ) : null}
    </button>
  );
};

export const GhostIconButton = ({
  type = "button",
  icon,
  processing,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className="btn btn-square btn-sm btn-ghost"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? (
        <span className="icon">
          {processing ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            icon
          )}
        </span>
      ) : null}
    </button>
  );
};

export const LinkIconButton = ({
  type = "button",
  icon,
  processing,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className="btn btn-square btn-sm btn-link"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? (
        <span className="icon">
          {processing ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            icon
          )}
        </span>
      ) : null}
    </button>
  );
};

export const InfoIconButton = ({
  type = "button",
  icon,
  processing,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className="btn btn-square btn-sm btn-info"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? (
        <span className="icon">
          {processing ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            icon
          )}
        </span>
      ) : null}
    </button>
  );
};

export const SuccessIconButton = ({
  type = "button",
  icon,
  processing,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className="btn btn-square btn-sm btn-success"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? (
        <span className="icon">
          {processing ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            icon
          )}
        </span>
      ) : null}
    </button>
  );
};

export const WarningIconButton = ({
  type = "button",
  icon,
  processing,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className="btn btn-square btn-sm btn-warning"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? (
        <span className="icon">
          {processing ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            icon
          )}
        </span>
      ) : null}
    </button>
  );
};

export const ErrorIconButton = ({
  type = "button",
  icon,
  processing,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className="btn btn-square btn-sm btn-error"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {icon ? (
        <span className="icon">
          {processing ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            icon
          )}
        </span>
      ) : null}
    </button>
  );
};
