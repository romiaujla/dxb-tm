type IncludeModel = {
    include: Record<string, IncludeModel | boolean>;
};

export type ObjectServiceQueryIncludeModel = IncludeModel["include"];
