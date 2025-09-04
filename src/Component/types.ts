export interface EnumOptions {
  allowed: string[];
  multiple?: boolean;
}

export interface RegexOptions {
  examples?: string[];
}

export type RuleParameterType = "enum" | "boolean" | "regex" | string;

interface RuleParameterOptions {
  low?: number;
  medium?: number;
  high?: number;
  [key: string]: any;
}

export interface RuleParameter {
  type: RuleParameterType;
  name: string;
  default: any;
  description: string;
  options?: RuleParameterOptions;
}

export interface Rule {
  rule_id: string;
  name: string;
  description: string;
  tags: string[];
  parameters: RuleParameter[];
}

export type ConfiguredParameters = { [paramName: string]: any };

export interface ConfiguredRule {
  rule_id: string;
  name: string;
  parameters: ConfiguredParameters;
}

