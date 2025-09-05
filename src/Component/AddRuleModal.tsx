import React, { useEffect, useMemo, useState } from "react";
import { mockRules } from "./mockRules";
import type { ConfiguredParameters, ConfiguredRule, Rule } from "./types";

interface AddRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rule: ConfiguredRule) => void;
}

const AddRuleModal: React.FC<AddRuleModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [rules] = useState<Rule[]>(mockRules);
  const [selectedRuleId, setSelectedRuleId] = useState<string>("");
  const selectedRule = useMemo(
    () => rules.find((r) => r.rule_id === selectedRuleId) || null,
    [rules, selectedRuleId]
  );
    
  const [formValues, setFormValues] = useState<ConfiguredParameters>({});
  const [regexInputs, setRegexInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!selectedRule) return;
    const defaults: ConfiguredParameters = {};
    selectedRule.parameters.forEach((p) => {
      defaults[p.name] = p.default;
    });
    setFormValues(defaults);
    setRegexInputs({});
  }, [selectedRule]);

  if (!isOpen) return null;

  const handleEnumChange = (name: string, value: string | string[], multiple?: boolean) => {
    if (multiple) {
      setFormValues((prev) => ({ ...prev, [name]: value as string[] }));
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value as string }));
    }
  };

  const handleBooleanChange = (name: string, value: boolean) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegexAdd = (name: string) => {
    const v = (regexInputs[name] || "").trim();
    if (!v) return;
    const current: string[] = Array.isArray(formValues[name]) ? formValues[name] : [];
    if (!current.includes(v)) {
      setFormValues((prev) => ({ ...prev, [name]: [...current, v] }));
    }
    setRegexInputs((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRegexRemove = (name: string, idx: number) => {
    const current: string[] = Array.isArray(formValues[name]) ? formValues[name] : [];
    const next = current.filter((_, i) => i !== idx);
    setFormValues((prev) => ({ ...prev, [name]: next }));
  };

  const submit = () => {
    if (!selectedRule) return;
    onSubmit({ rule_id: selectedRule.rule_id, name: selectedRule.name, parameters: formValues });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative glass-card w-full max-w-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="glass-title mb-0">Add a Rule</h3>
          <button className="text-sm px-2 py-1" onClick={onClose}>Close</button>
        </div>

        {/* Rule selector */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Choose a rule</label>
          <select
            value={selectedRuleId}
            onChange={(e) => setSelectedRuleId(e.target.value)}
            className="w-full p-2 rounded-md bg-white text-black border border-black/20"
          >
            <option value="">-- Select a rule --</option>
            {rules.map((r) => (
              <option key={r.rule_id} value={r.rule_id}>{r.name}</option>
            ))}
          </select>
        </div>

        {/* Parameters form */}
        {selectedRule && (
          <div className="space-y-4">
            <p className="text-sm opacity-80">{selectedRule.description}</p>
            {selectedRule.parameters.map((param) => {
              const isEnum = param.type === "enum";
              const isBoolean = param.type === "boolean";
              const isRegex = param.type === "regex";

              return (
                <div key={param.name} className="border border-white/10 rounded-md p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium">{param.name}</div>
                      <div className="text-xs opacity-70">{param.description}</div>
                    </div>
                  </div>

                  {isEnum && (
                    <div>
                      {param.options?.multiple ? (
                        <div className="flex flex-wrap gap-2">
                          {(param.options?.allowed || []).map((opt: string) => {
                            const current: string[] = Array.isArray(formValues[param.name]) ? formValues[param.name] : [];
                            const checked = current.includes(opt);
                            const toggle = () => {
                              const next = checked ? current.filter((v) => v !== opt) : [...current, opt];
                              handleEnumChange(param.name, next, true);
                            };
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={toggle}
                                className={`px-3 py-1 rounded-md border ${checked ? "bg-green-500/20 border-green-400/40" : "border-white/20"}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <select
                          value={(formValues[param.name] as string) ?? ""}
                          onChange={(e) => handleEnumChange(param.name, e.target.value)}
                          className="w-full p-2 rounded-md bg-white text-black border border-white/20"
                        >
                          {(param.options?.allowed || []).map((opt: string) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}

                  {isBoolean && (
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={Boolean(formValues[param.name])}
                        onChange={(e) => handleBooleanChange(param.name, e.target.checked)}
                      />
                      <span>Enabled</span>
                    </label>
                  )}

                  {isRegex && (
                    <div>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Add pattern (regex)"
                          value={regexInputs[param.name] || ""}
                          onChange={(e) => setRegexInputs((prev) => ({ ...prev, [param.name]: e.target.value }))}
                          className="flex-1 p-2 rounded-md bg-transparent border border-white/20"
                        />
                        <button type="button" className="px-3 py-2 glass-card" onClick={() => handleRegexAdd(param.name)}>
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(formValues[param.name]) ? formValues[param.name] : []).map((val: string, idx: number) => (
                          <span key={`${val}-${idx}`} className="px-2 py-1 rounded-md border border-white/20 text-sm inline-flex items-center gap-2">
                            {val}
                            <button type="button" className="opacity-70 hover:opacity-100" onClick={() => handleRegexRemove(param.name, idx)}>
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      {param.options?.examples && param.options.examples.length ? (
                        <div className="text-xs opacity-60 mt-2">
                          Examples: {param.options.examples.join(", ")}
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="flex justify-end gap-2 pt-2">
              <button className="px-3 py-2" onClick={onClose}>Cancel</button>
              <button className="px-3 py-2 glass-card" onClick={submit}>
                Add Rule
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddRuleModal;
