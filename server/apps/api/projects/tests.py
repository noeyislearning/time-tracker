from django.test import TestCase
from django.utils import timezone
from .models import Project

class ProjectModelTestCase(TestCase):
    def test_save_method_with_missing_route(self):
        """
        Test the save method when route is missing.
        """
        # Create a project without a route
        project = Project(name='Test Project', added_by_id=1)  # Replace added_by_id with an existing user ID

        # Save the project
        project.save()

        # Check if route is generated correctly
        self.assertEqual(project.route, 'test-project')  # Replace 'test-project' with the expected slug

    def test_str_method(self):
        """
        Test the string representation (__str__ method) of the Project model.
        """
        project = Project(name='Test Project', route='test-project', added_by_id=1)  # Replace added_by_id with an existing user ID
        self.assertEqual(str(project), 'Test Project')
