package com.pranjal.portfolio.controller;

import org.springframework.web.bind.annotation.*;
import com.pranjal.portfolio.service.AIChatService;

@RestController
@RequestMapping("/api/chat")
public class AIChatController {

    private final AIChatService aiChatService;

    public AIChatController(AIChatService aiChatService) {
        this.aiChatService = aiChatService;
    }

    @PostMapping
    public String chat(@RequestBody String message) {
        return aiChatService.getAIResponseString(message);
    }
}
