package edu.ucsb.cs156.example.web;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class MenuItemReviewWebIT extends WebTestCase {
  @Test
  public void admin_user_can_create_edit_delete_review() throws Exception {
    setupUser(true);

    page.getByText("Menu Item Review").click();

    page.getByText("Create MenuItemReview").click();
    assertThat(page.getByText("Create New MenuItemReview")).isVisible();

    page.getByTestId("MenuItemReviewForm-itemId").fill("1");
    page.getByTestId("MenuItemReviewForm-reviewerEmail").fill("tladha@ucsb.edu");
    page.getByTestId("MenuItemReviewForm-stars").fill("5");
    page.getByTestId("MenuItemReviewForm-dateReviewed").fill("2026-04-03T00:00");
    page.getByTestId("MenuItemReviewForm-comments").fill("Really good");
    page.getByTestId("MenuItemReviewForm-submit").click();

    assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-comments"))
        .hasText("Really good");

    page.getByTestId("MenuItemReviewTable-cell-row-0-col-Edit-button").click();
    assertThat(page.getByText("Edit MenuItemReview")).isVisible();

    page.getByTestId("MenuItemReviewForm-comments").fill("THE BEST");
    page.getByTestId("MenuItemReviewForm-submit").click();

    assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-comments")).hasText("THE BEST");

    page.getByTestId("MenuItemReviewTable-cell-row-0-col-Delete-button").click();

    assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-comments")).not().isVisible();
  }

  @Test
  public void regular_user_cannot_create_review() throws Exception {
    setupUser(false);

    page.getByText("Menu Item Review").click();

    assertThat(page.getByText("Create MenuItemReview")).not().isVisible();
    assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-name")).not().isVisible();
  }
}
