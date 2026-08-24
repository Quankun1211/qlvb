ALTER TABLE group_members
    ADD CONSTRAINT uk_group_member_unit
    UNIQUE (group_id, unit_id);

ALTER TABLE group_members
    ADD CONSTRAINT uk_group_member_department
    UNIQUE (group_id, department_id);

ALTER TABLE group_members
    ADD CONSTRAINT uk_group_member_user
    UNIQUE (group_id, user_id);