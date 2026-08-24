package com.qlvb.mofa.service;

import com.qlvb.mofa.dto.enums.GroupType;
import com.qlvb.mofa.dto.request.CreateFrequentGroupRequest;
import com.qlvb.mofa.dto.request.FrequentGroupSearchRequest;
import com.qlvb.mofa.dto.response.FrequentGroupMemberResponse;
import com.qlvb.mofa.dto.response.FrequentGroupResponse;
import com.qlvb.mofa.entity.Department;
import com.qlvb.mofa.entity.FrequentGroup;
import com.qlvb.mofa.entity.GroupMember;
import com.qlvb.mofa.entity.Unit;
import com.qlvb.mofa.entity.User;
import com.qlvb.mofa.repository.DepartmentRepository;
import com.qlvb.mofa.repository.FrequentGroupRepository;
import com.qlvb.mofa.repository.GroupMemberRepository;
import com.qlvb.mofa.repository.UnitRepository;
import com.qlvb.mofa.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.qlvb.mofa.specification.FrequentGroupSpecification;
import static com.qlvb.mofa.specification.FrequentGroupSpecification.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class FrequentGroupService {

    private final FrequentGroupRepository frequentGroupRepository;
    private final GroupMemberRepository groupMemberRepository;

    private final UnitRepository unitRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    private final UserService userService;

    @Transactional
    public FrequentGroupResponse create(
            String username,
            CreateFrequentGroupRequest request
    ) {

        User createdBy =
                userService.findActiveByUsername(username);

   
        if (frequentGroupRepository
                .existsByNameIgnoreCase(request.getName())) {

            throw new IllegalArgumentException(
                    "Tên nhóm đã tồn tại: " + request.getName()
            );
        }

        if (request.getMemberIds() == null
                || request.getMemberIds().isEmpty()) {

            throw new IllegalArgumentException(
                    "Phải chọn ít nhất một thành viên"
            );
        }

        Set<Long> uniqueIds =
                new HashSet<>(request.getMemberIds());

        if (uniqueIds.size()
                != request.getMemberIds().size()) {

            throw new IllegalArgumentException(
                    "Danh sách thành viên bị trùng"
            );
        }

        LocalDateTime now = LocalDateTime.now();

        FrequentGroup group =
                FrequentGroup.builder()
                        .name(request.getName().trim())
                        .shortName(
                                request.getShortName() != null
                                        ? request.getShortName().trim()
                                        : null
                        )
                        .description(request.getDescription())
                        .documentClassification(
                                request.getDocumentClassification()
                        )
                        .groupType(request.getGroupType())
                        .status((byte) 1)
                        .createdBy(createdBy)
                        .createdAt(now)
                        .updatedAt(now)
                        .build();

        group =
                frequentGroupRepository.save(group);

        createMembers(
                group,
                request.getGroupType(),
                request.getMemberIds()
        );

        group.setMembers(
                groupMemberRepository
                        .findAllByGroupId(group.getId())
        );

        return toResponse(group);
    }

    private void createMembers(
            FrequentGroup group,
            GroupType groupType,
            List<Long> memberIds
    ) {

        switch (groupType) {

            case UNIT -> createUnitMembers(
                    group,
                    memberIds
            );

            case DEPARTMENT -> createDepartmentMembers(
                    group,
                    memberIds
            );

            case USER -> createUserMembers(
                    group,
                    memberIds
            );

            default -> throw new IllegalArgumentException(
                    "Loại nhóm không hợp lệ"
            );
        }
    }

    private void createUnitMembers(
            FrequentGroup group,
            List<Long> ids
    ) {

        List<Unit> units =
                unitRepository.findAllByIdInAndStatus(
                        ids,
                        (byte) 1
                );

        validateFoundIds(
                ids,
                units.stream()
                        .map(Unit::getId)
                        .toList(),
                "đơn vị"
        );

        List<GroupMember> members =
                units.stream()
                        .map(unit ->
                                GroupMember.builder()
                                        .group(group)
                                        .unit(unit)
                                        .createdAt(
                                                LocalDateTime.now()
                                        )
                                        .build()
                        )
                        .toList();

        groupMemberRepository.saveAll(members);
    }

    private void createDepartmentMembers(
            FrequentGroup group,
            List<Long> ids
    ) {

        List<Department> departments =
                departmentRepository
                        .findAllByIdInAndStatus(
                                ids,
                                (byte) 1
                        );

        validateFoundIds(
                ids,
                departments.stream()
                        .map(Department::getId)
                        .toList(),
                "phòng ban"
        );

        List<GroupMember> members =
                departments.stream()
                        .map(department ->
                                GroupMember.builder()
                                        .group(group)
                                        .department(department)
                                        .createdAt(
                                                LocalDateTime.now()
                                        )
                                        .build()
                        )
                        .toList();

        groupMemberRepository.saveAll(members);
    }

    private void createUserMembers(
            FrequentGroup group,
            List<Long> ids
    ) {

        List<User> users =
                userRepository.findAllByIdInAndStatus(
                        ids,
                        (byte) 1
                );

        validateFoundIds(
                ids,
                users.stream()
                        .map(User::getId)
                        .toList(),
                "người dùng"
        );

        List<GroupMember> members =
                users.stream()
                        .map(user ->
                                GroupMember.builder()
                                        .group(group)
                                        .user(user)
                                        .createdAt(
                                                LocalDateTime.now()
                                        )
                                        .build()
                        )
                        .toList();

        groupMemberRepository.saveAll(members);
    }

    private void validateFoundIds(
            List<Long> requestedIds,
            List<Long> foundIds,
            String type
    ) {

        Set<Long> found =
                new HashSet<>(foundIds);

        List<Long> missing =
                requestedIds.stream()
                        .filter(id -> !found.contains(id))
                        .toList();

        if (!missing.isEmpty()) {

            throw new IllegalArgumentException(
                    "Không tìm thấy "
                            + type
                            + " hoặc "
                            + type
                            + " không hoạt động: "
                            + missing
            );
        }
    }

    @Transactional(readOnly = true)
    public FrequentGroupResponse getById(
            Long id
    ) {

        FrequentGroup group =
                frequentGroupRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Không tìm thấy nhóm: " + id
                                )
                        );

        group.setMembers(
                groupMemberRepository
                        .findAllByGroupId(id)
        );

        return toResponse(group);
    }

    @Transactional(readOnly = true)
    public Page<FrequentGroupResponse> getAll(
            Pageable pageable
    ) {

        return frequentGroupRepository
                .findAllByStatus(
                        (byte) 1,
                        pageable
                )
                .map(group -> {

                    group.setMembers(
                            groupMemberRepository
                                    .findAllByGroupId(
                                            group.getId()
                                    )
                    );

                    return toResponse(group);
                });
    }

    @Transactional(readOnly = true)
    public Page<FrequentGroupResponse> getAll(
            FrequentGroupSearchRequest request,
            Pageable pageable
    ) {

        var specification =
                Specification.allOf(
                        keyword(request.getKeyword()),
                        documentClassification(
                                request.getDocumentClassification()
                        ),
                        groupType(
                                request.getGroupType()
                        ),
                        status(
                                request.getStatus()
                        )
                );

        Page<FrequentGroup> page =
                frequentGroupRepository.findAll(
                        specification,
                        pageable
                );

        return page.map(group -> {

            List<GroupMember> members =
                    groupMemberRepository
                            .findAllByGroupIdOrderByIdAsc(
                                    group.getId()
                            );

            return toResponse(
                    group,
                    members
            );
        });
    }

    private FrequentGroupResponse toResponse(
            FrequentGroup group
    ) {

        List<GroupMember> members =
                group.getMembers() != null
                        ? group.getMembers()
                        : List.of();

        return FrequentGroupResponse.builder()
                .id(group.getId())
                .name(group.getName())
                .shortName(group.getShortName())
                .description(group.getDescription())
                .documentClassification(
                        group.getDocumentClassification()
                )
                .groupType(group.getGroupType())
                .status(group.getStatus())
                .createdById(
                        group.getCreatedBy() != null
                                ? group.getCreatedBy().getId()
                                : null
                )
                .createdByName(
                        group.getCreatedBy() != null
                                ? group.getCreatedBy().getFullName()
                                : null
                )
                .createdAt(group.getCreatedAt())
                .updatedAt(group.getUpdatedAt())
                .members(
                        members.stream()
                                .map(this::toMemberResponse)
                                .toList()
                )
                .build();
    }

    private FrequentGroupResponse toResponse(
        FrequentGroup group,
        List<GroupMember> members
    ) {

        return FrequentGroupResponse.builder()

                .id(group.getId())

                .name(group.getName())

                .shortName(group.getShortName())

                .description(group.getDescription())

                .documentClassification(
                        group.getDocumentClassification()
                )

                .groupType(
                        group.getGroupType()
                )

                .status(
                        group.getStatus()
                )

                .createdById(
                        group.getCreatedBy() != null
                                ? group.getCreatedBy().getId()
                                : null
                )

                .createdByName(
                        group.getCreatedBy() != null
                                ? group.getCreatedBy().getFullName()
                                : null
                )

                .createdAt(
                        group.getCreatedAt()
                )

                .updatedAt(
                        group.getUpdatedAt()
                )

                .members(
                        members.stream()
                                .map(this::toMemberResponse)
                                .toList()
                )

                .build();
    }

    private FrequentGroupMemberResponse toMemberResponse(
            GroupMember member
    ) {

        return FrequentGroupMemberResponse.builder()
                .id(member.getId())

                .userId(
                        member.getUser() != null
                                ? member.getUser().getId()
                                : null
                )

                .userName(
                        member.getUser() != null
                                ? member.getUser().getFullName()
                                : null
                )

                .departmentId(
                        member.getDepartment() != null
                                ? member.getDepartment().getId()
                                : null
                )

                .departmentName(
                        member.getDepartment() != null
                                ? member.getDepartment().getName()
                                : null
                )

                .unitId(
                        member.getUnit() != null
                                ? member.getUnit().getId()
                                : null
                )

                .unitName(
                        member.getUnit() != null
                                ? member.getUnit().getName()
                                : null
                )

                .build();
    }
}