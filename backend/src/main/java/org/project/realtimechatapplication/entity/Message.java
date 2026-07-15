package org.project.realtimechatapplication.entity;

import jakarta.persistence.*;
import lombok.*;
import org.project.realtimechatapplication.enums.MessageType;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Chat Room
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    /**
     * Sender
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    /**
     * Encrypted Message
     */
    @Lob
    @Column(nullable = false)
    private String encryptedMessage;

    private LocalDateTime sentAt;

    @PrePersist
    public void prePersist() {
        sentAt = LocalDateTime.now();
    }
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MessageType messageType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Message parent;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "message_seen",
            joinColumns = @JoinColumn(name = "message_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Builder.Default
    private java.util.Set<User> seenBy = new java.util.HashSet<>();

}