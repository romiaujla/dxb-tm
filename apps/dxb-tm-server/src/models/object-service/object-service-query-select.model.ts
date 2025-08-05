type SelectModel = {
    select: Record<string, SelectModel | boolean>;
};

export type ObjectServiceQuerySelectModel = SelectModel["select"];
